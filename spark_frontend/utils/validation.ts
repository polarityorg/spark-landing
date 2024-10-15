export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+\d{10,15}$/;
  return phoneRegex.test(phoneNumber);
};

export const isValidPublicKey = (pubKey: string): boolean => {
  const pubKeyRegex = /^[0-9a-fA-F]{66}$|^[0-9a-fA-F]{130}$/;
  return pubKeyRegex.test(pubKey);
};



export function isValidBitcoinAddress(address: string): boolean {
  // Implement real validation logic, or use a validation library
  // For now, we'll do a simple length check
  return address.length > 20;
}

export const formatSats = (sats: number) => {
  if (sats >= 1000000000) {
    return (sats / 1000000000).toFixed(2) + "B";
  } else if (sats >= 1000000) {
    return (sats / 1000000).toFixed(2) + "M";
  } else if (sats >= 1000) {
    return (sats / 1000).toFixed(2) + "k";
  } else {
    return sats.toString();
  }
};
