const { faker } = require('@faker-js/faker');

class DataFaker {
    constructor() {
    }

    getFirstName(gender = null) {
        const genders = ['female', 'male'];
        gender == null ? gender = genders[Math.floor(Math.random() * genders.length)] : gender
        return faker.name.firstName(gender);
    }

    getUUID() {
        const uuid = require('uuid');
        return uuid.v4();
    }

    getLastName() {
        //remove replace later
        return faker.name.lastName().replace(/['"]+/g, '');
    }

    getCompanyName() {
        //remove replace later
        return faker.company.name().replace(/['"]+/g, '');
    }

    getFullName(gender = null) {
        const genders = ['female', 'male'];
        gender == null ? gender = genders[Math.floor(Math.random() * genders.length)] : gender
        return this.getFirstName(gender) + " " + this.getLastName().replace(/['"]+/g, '');
    }

    getEmail(completeName = null) {
        let numbers = this.getTimestamp();
        if (completeName == null) {
            return faker.internet.email('', `${numbers}`).toLowerCase();
        }
        else {
            return faker.internet.email('', completeName[1].toLowerCase() + `${numbers}`).toLowerCase();
        }
    }

    getZipCode(withMask = false) {
        let zipCodes = null;
        withMask ? zipCodes = ['03259-000', '07097-380', '04794-000'] : zipCodes = ['03259000', '07097380', '70715900', '04794000'];
        return zipCodes[Math.floor(Math.random() * zipCodes.length)];
    }

    getPassword(characters) {
        return faker.internet.password(characters);
    }

    getNumberFloat() {
        return faker.datatype.float({ min: 50, max: 100 });
    }

    getMobilePhone() {
        const mobilePhones = ['982591133', '983863195'];
        return mobilePhones[Math.floor(Math.random() * mobilePhones.length)];
    }

    getMobilePhoneWithDDD() {
        const mobilePhones = ['11 98259-1133', '67 98811-8443', '61 98726-8484', '81 98194-3238'];
        return mobilePhones[Math.floor(Math.random() * mobilePhones.length)];
    }

    getLandlinePhone() {
        const landlinePhones = ['38627655', '33376461', '22543824', '28422869'];
        return landlinePhones[Math.floor(Math.random() * landlinePhones.length)];
    }

    getCpf() {
        const fakerBr = require('faker-br');
        return fakerBr.br.cpf();
    }

    getCnpj() {
        const fakerBr = require('faker-br');
        return fakerBr.br.cnpj();
    }

    getStatePrefixBr() {
        const states = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
        return states[Math.floor(Math.random() * states.length)];
    }

    getStateTaxId() {
        return new Date().getTime().toString();
    }

    getTimestamp() {
        return Date.now();
    }

    getRandomNumber(max) {
        return faker.datatype.number({ min: 1, max: max });
    }

    getMobilePhoneRandom() {
        return faker.phone.number('119########');
    }

    getLandlinePhoneRandom() {
        return faker.phone.number('11########');
    }

    getComplement() {
        const complements = ["Jardim da Qualidade", "Vila Qualidade", "Bosque Automação", "Parque dos Testes"];
        return complements[Math.floor(Math.random() * complements.length)];
    }

    getStreetName() {
        return faker.address.streetName();
    }

    getNeighborhood() {
        return `Jardim da ${this.getFirstName()}`;
    }

    getCity() {
        return faker.address.city();
    }
}

module.exports = { DataFaker };