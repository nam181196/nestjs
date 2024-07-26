import * as zxcvbn from 'zxcvbn';

export class PasswordStrengthService {
  checkStrength(password: string) {
    return zxcvbn(password);
  }
}
