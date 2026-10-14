// NZ unit prices confirmed by Stephen on 15 October 2026; GST is additional.
// The same unit references are used in the NZ product master and request service.
export const equipmentPriceStatus = 'confirmed' as const;
export const equipment = [
  {
    slug: 'e-connect-s', sku: 'EIGHTEETH-ECS', name: 'E-Connect S',
    category: 'Endodontic motor', stage: 'Shape with control',
    description: 'Cordless shaping with a built-in apex locator, rotary and reciprocating modes.',
    image: '/products/eighteeth/e-connect-s.webp', price: 1295,
    manufacturer: 'https://www.eighteeth.com/Endo-Motor/11.html',
    manual: '/downloads/eighteeth/E-Connect-S-User-Manual.pdf',
    brochure: '/downloads/eighteeth/E-Connect-S-Manufacturer-Brochure.pdf',
  },
  {
    slug: 'ultra-x', sku: 'EIGHTEETH-ULTRAX', name: 'Ultra X',
    category: 'Ultrasonic activator', stage: 'Activate your irrigation',
    description: 'Cordless ultrasonic activation to put your irrigant into motion after shaping.',
    image: '/products/eighteeth/ultra-x.webp', price: 795,
    manufacturer: 'https://www.eighteeth.com/ultrasonic-device/9.html',
    manual: '/downloads/eighteeth/Ultra-X-User-Manual.pdf',
    brochure: '/downloads/eighteeth/Ultra-X-Manufacturer-Brochure.pdf',
  },
] as const;

export const formatEquipmentPrice = (amount: number) =>
  new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD', minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 }).format(amount);

export const equipmentForSku = (sku: string) => equipment.find(item => item.sku === sku);

export const getEquipmentTotals = (lines: Array<{ sku: string; quantity: number }>) => {
  const selected = lines.flatMap(line => {
    const item = equipmentForSku(line.sku);
    return item ? [{ ...line, item }] : [];
  });
  const netCents = selected.reduce((total, line) => total + Math.round(line.item.price * 100) * line.quantity, 0);
  const gstCents = Math.round(netCents * 0.15);
  return {
    selected, net: netCents / 100, gst: gstCents / 100, total: (netCents + gstCents) / 100,
    hasOtherItems: lines.some(line => !equipmentForSku(line.sku)),
  };
};
