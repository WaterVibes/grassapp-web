import { Patient, OrderItem, ComplianceCheck } from '../../types/buddy';

// Maryland legal possession limits
const LEGAL_LIMITS = {
  FLOWER_GRAMS: 120, // 120 grams of flower
  CONCENTRATE_GRAMS: 36, // 36 grams of concentrate
  THC_MG: 1800, // 1800mg of THC in infused products
};

// Convert THC percentage to mg for calculations
const thcPercentageToMg = (thcPercentage: string, quantity: string): number => {
  const percentage = parseFloat(thcPercentage) / 100;
  const grams = parseFloat(quantity.replace('g', ''));
  return percentage * grams * 1000; // Convert to mg
};

export const checkCompliance = (
  patient: Patient,
  orderItems: OrderItem[]
): ComplianceCheck => {
  let totalFlower = (patient.currentPossession?.flower || 0);
  let totalConcentrate = (patient.currentPossession?.concentrate || 0);
  let totalTHC = (patient.currentPossession?.thcProducts || 0);

  // Calculate totals including new order
  orderItems.forEach(item => {
    const quantity = parseFloat(item.quantity.replace('g', ''));
    
    switch (item.type) {
      case 'flower':
        totalFlower += quantity;
        break;
      case 'concentrate':
        totalConcentrate += quantity;
        totalTHC += thcPercentageToMg(item.thc, item.quantity);
        break;
      case 'edible':
        totalTHC += thcPercentageToMg(item.thc, item.quantity);
        break;
    }
  });

  const withinFlowerLimit = totalFlower <= LEGAL_LIMITS.FLOWER_GRAMS;
  const withinConcentrateLimit = totalConcentrate <= LEGAL_LIMITS.CONCENTRATE_GRAMS;
  const withinTHCLimit = totalTHC <= LEGAL_LIMITS.THC_MG;

  let message = 'Order is compliant with MMCC regulations';
  
  if (!withinFlowerLimit) {
    message = `Exceeds flower limit by ${(totalFlower - LEGAL_LIMITS.FLOWER_GRAMS).toFixed(1)}g`;
  } else if (!withinConcentrateLimit) {
    message = `Exceeds concentrate limit by ${(totalConcentrate - LEGAL_LIMITS.CONCENTRATE_GRAMS).toFixed(1)}g`;
  } else if (!withinTHCLimit) {
    message = `Exceeds THC limit by ${(totalTHC - LEGAL_LIMITS.THC_MG).toFixed(0)}mg`;
  }

  return {
    withinFlowerLimit,
    withinConcentrateLimit,
    withinTHCLimit,
    message
  };
}; 