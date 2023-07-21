FROM mcr.microsoft.com/playwright:v1.35.0-focal

# Limpar a pasta de cache do npm
RUN rm -rf /root/.npm

WORKDIR /base-playwright-js-qa

ENV PATH /base-playwright-js-qa/node_modules/.bin:$PATH

COPY package*.json /base-playwright-js-qa/
COPY playwright.config*.js /base-playwright-js-qa/
COPY tests/ /base-playwright-js-qa/tests/
COPY allure-results /base-playwright-js-qa/allure-results

RUN apt-get update && apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev zip unzip

# Install JAVA
RUN apt install -y default-jre
RUN wget -q https://github.com/allure-framework/allure2/releases/download/2.22.0/allure-2.22.0.tgz
RUN tar -zxvf allure-2.22.0.tgz -C /opt/
RUN ln -s /opt/allure-2.22.0/bin/allure /usr/bin/allure

# Removing folder allure .tgz after installed
RUN rm -R allure-2.22.0.tgz

RUN chmod 777 -R /base-playwright-js-qa

RUN npm install

# RUN npm ci
# CMD npm run test

RUN chmod 777 -R /base-playwright-js-qa