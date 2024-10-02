export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+\d{10,15}$/;
  return phoneRegex.test(phoneNumber);
};

export const isValidPublicKey = (pubKey: string): boolean => {
  const pubKeyRegex = /^[0-9a-fA-F]{66}$|^[0-9a-fA-F]{130}$/;
  return pubKeyRegex.test(pubKey);
};

export const otpIsValid = (otp: string): boolean => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

export function isValidBitcoinAddress(address: string): boolean {
  // Implement real validation logic, or use a validation library
  // For now, we'll do a simple length check
  return address.length > 20;
}