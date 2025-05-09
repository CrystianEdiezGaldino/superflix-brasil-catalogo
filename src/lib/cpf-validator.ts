
/**
 * Validates a CPF number (Brazilian individual taxpayer registry identification)
 * @param cpf CPF number to validate (can include dots and dash)
 * @returns boolean indicating if the CPF is valid
 */
export function validateCPF(cpf: string): boolean {
  // Empty CPFs are invalid
  if (!cpf || cpf.trim() === '') {
    return false;
  }
  
  // Remove any character that is not a number
  cpf = cpf.replace(/\D/g, '');
  
  // Must be 11 digits
  if (cpf.length !== 11) {
    return false;
  }
  
  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  
  // Calculate first verifier digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  // Calculate second verifier digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  // Check if calculated verifier digits match the actual ones
  return (
    parseInt(cpf.charAt(9)) === digit1 && 
    parseInt(cpf.charAt(10)) === digit2
  );
}
