pipeline {
  agent {
    docker {
      image "${params.playwright_js_docker_image}"
      args '-v /var/jenkins_home:/var/jenkins_home -v /var/lib/jenkins:/var/lib/jenkins'
    }
  }
  
  environment {
    aws_region = 'us-east-2'
  }

  parameters {
    string(
      name: 'playwright_js_docker_image',
      defaultValue:'758526784474.dkr.ecr.us-east-1.amazonaws.com/base-playwright-js-qa:develop',
      description: 'The cucumber docker image'
    )
    string(
      name: 'command_run',
      defaultValue:'npm run api --grep @crudApiLivros',
      description: 'Where you set cucumber tag'
    )
    string(
      name: 'env',
      defaultValue:'dev',
      description: 'Where you set environment (dev|hml|prd|dr)'
    )
  }
    stages {
      stage('CLEANING WORKDIR') {
         steps {
             deleteDir()
         }
      }
      stage('RUNNING PLAYWRIGHT TESTS') {
        steps {
          catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
            slackSend(channel: "#reports-cucumber-tests", color: '#FFFF00', message: "Tests Started \n Command Run: ${params.command_run} \n Image: ${params.playwright_js_docker_image} \n Build Number: ${BUILD_NUMBER} \n Pipeline: ${JOB_NAME} \n Build Console: ${BUILD_URL}console")
            configFileProvider([configFile(fileId: "${params.env}", variable:"${params.env}")]) {
              wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'xterm']) {
                sh "cd /base-playwright-js-qa && . \$${params.env} >> /dev/null && ${params.command_run}"
              }
            }
          }
        }
      }
    }
    post {
      always{
      echo "TESTS FINISHED"
        sh 'cd /base-playwright-js-qa && zip -r allure-results allure-results'
        sh 'cp /base-playwright-js-qa/allure-results.zip ${WORKSPACE}/'
        sh 'cd /base-playwright-js-qa && rm -R allure-results.zip'
        sh 'cd ${WORKSPACE} && unzip allure-results.zip'
        sh 'cd ${WORKSPACE} && rm -R allure-results.zip'
        sh 'mkdir -p ${WORKSPACE}/reports/playwright-report && cp -R /base-playwright-js-qa/reports/playwright-report/* ${WORKSPACE}/reports/playwright-report'
        archiveArtifacts artifacts: 'reports/playwright-report/'
         allure([
          includeProperties: true,
          jdk: '',
          reportBuildPolicy: 'ALWAYS',
          results: [[path: 'allure-results']]
        ])
        // sh 'mkdir allure-report-${JOB_NAME}-${BUILD_NUMBER}'
        // sh 'cp ../../jobs/${JOB_NAME}/builds/${BUILD_NUMBER}/archive/allure-report.zip allure-report-${JOB_NAME}-${BUILD_NUMBER}'
        // sh 'cd allure-report-${JOB_NAME}-${BUILD_NUMBER} && unzip allure-report.zip'
        // sh "aws s3 cp allure-report-${JOB_NAME}-${BUILD_NUMBER}/allure-report s3://report-tests/${JOB_NAME}/${params.env}/${BUILD_NUMBER} --recursive"
        // sh "aws s3 cp reports/playwright-report s3://report-tests/${JOB_NAME}/${params.env}/${BUILD_NUMBER}/playwright-report --recursive"
        script {
          if ("${currentBuild.result}" == "SUCCESS") {
             slackSend(channel: "#reports-cucumber-tests", color: "#00FF00", message: "Tests Finished \n Command Run: ${params.command_run} \n Build Number: ${BUILD_NUMBER} \n Pipeline: ${JOB_NAME} \n Report Allure: https://jenkins.dock.tech/job/${JOB_NAME}/${BUILD_NUMBER}/allure/index.html \n Pipeline Results: ${currentBuild.result}")
        } else if ("${currentBuild.result}" == "UNSTABLE") {
            slackSend(channel: "#reports-cucumber-tests", color: "#FF0000", message: "Tests Finished \n Command Run: ${params.command_run} \n Build Number: ${BUILD_NUMBER} \n Pipeline: ${JOB_NAME} \n Report Allure: https://jenkins.dock.tech/job/${JOB_NAME}/${BUILD_NUMBER}/allure/index.html \n Pipeline Results: ${currentBuild.result}")
        } else {
            slackSend(channel: "#reports-cucumber-tests", color: "", message: "Problem Tests \n Command Run: ${params.command_run} \n Build Number: ${BUILD_NUMBER} \n Pipeline: ${JOB_NAME} \n Report Allure: https://jenkins.dock.tech/job/${JOB_NAME}/${BUILD_NUMBER}/allure/index.html \n Pipeline Results: ${currentBuild.result}")
        }
        }
      }
    }
  }