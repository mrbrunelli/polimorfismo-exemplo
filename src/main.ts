import validatorlib1 from "validator";
import validatorlib2 from "email-validator";

/**
 * Primeiro passo:
 * Criar um contrato. Dessa forma quem implementar este contrato deverá seguir todas as suas exigências.
 */
interface IEmailValidator {
  isValid(email: string): boolean;
}

/**
 * Segundo passo:
 * Criar uma fábrica de Validadores de Email. Dessa forma a criação de implementações é restrita apenas a esse serviço.
 * O método create só tem uma exigência: O parâmetro deve ser uma implementação de IEmailValidator.
 * Dessa forma é garantido que todas as instâncias criadas através dessa fábrica terão o mesmo formato.
 */
class EmailValidatorFactory {
  static create(emailValidator: IEmailValidator) {
    return emailValidator;
  }
}

/**
 * Terceiro passo:
 * Implementar os Validadores de Email.
 * Veja que duas das implementações estão usando bibliotecas externas.
 * Independente do tipo de validador utilizado, ele tem que seguir as regras, deve receber uma string e retornar boolean.
 * Meu sistema não precisa saber se estou usando a biblioteca x ou y, ele só precisa saber que existe um módulo que fará esse serviço.
 */
class EmailValidatorImpl1 implements IEmailValidator {
  isValid(email: string): boolean {
    return validatorlib1.isEmail(email);
  }
}

class EmailValidatorImpl2 implements IEmailValidator {
  isValid(email: string): boolean {
    return validatorlib2.validate(email);
  }
}

class EmailValidatorImpl3 implements IEmailValidator {
  isValid(email: string): boolean {
    return email.includes("@") && email.includes(".com");
  }
}

/**
 * Veja que essa implementação recebe uma string e retorna um boolean, mas ela não implementou o contrato.
 * Dessa forma a fábrica de validadores de email não irá aceitar essa instância, protegendo nosso sistema de variações desconhecidas.
 */
class InvalidEmailValidatorImpl {
  isEmail(email: string): boolean {
    return email.includes("@") && email.includes(".com");
  }
}

/**
 * Agora meu sistema possuí 3 implementações do serviço de validar emails.
 * Caso eu queira adicionar um 4º serviço, basta criar uma nova implementação que siga o contrato.
 */
function main() {
  const emailValidator1 = EmailValidatorFactory.create(
    new EmailValidatorImpl1()
  );
  const emailValidator2 = EmailValidatorFactory.create(
    new EmailValidatorImpl2()
  );
  const emailValidator3 = EmailValidatorFactory.create(
    new EmailValidatorImpl3()
  );

  /**
   * O compilador do Typescript irá rejeitar essa implementação, causando erro durante a compilação.
   * Nossa fábrica espera receber instâncias que tenham implementado o contrato IEmailValidator.
   * Descomente essa linha e tente rodar 'yarn start'
   */
  // const invalidEmailValidator = EmailValidatorFactory.create(
  //   new InvalidEmailValidatorImpl()
  // );

  const result = {
    validator1: emailValidator1.isValid("myemail@mail.com"),
    validator2: emailValidator2.isValid("myemail@mail.com"),
    validator3: emailValidator3.isValid("invalid@mail"),
  };

  console.log(result); // { validator1: true, validator2: true, validator3: false }

  /**
   * Isso é Polimorfismo, minha fábrica de validador de email retornou três instâncias de implementações diferentes,
   * porém todas respeitaram o contrato.
   * Dessa forma eu poderia ir plugando vários validadores de email durante o tempo de vida do meu sistema.
   * Surgiu uma biblioteca que valida email 20ms mais rápido que a antiga? É só criar uma implementação dela e trocar a antiga pela nova lá na nossa Fábrica.
   */
  const instances = {
    validator1: emailValidator1 instanceof EmailValidatorImpl1,
    validator2: emailValidator2 instanceof EmailValidatorImpl2,
    validator3: emailValidator3 instanceof EmailValidatorImpl3,
  };

  console.log(instances); // { validator1: true, validator2: true, validator3: true }
}

main();
