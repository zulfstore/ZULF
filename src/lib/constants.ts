export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Larkana',
  'Sheikhupura',
  'Jhang',
  'Rahim Yar Khan',
  'Gujrat',
  'Kasur',
  'Mardan',
  'Sahiwal',
  'Okara',
  'Wah Cantt',
  'Dera Ghazi Khan',
  'Mirpur (AJK)',
  'Muzaffarabad (AJK)',
  'Chiniot',
  'Kamoke',
  'Hafizabad',
  'Attock',
  'Kohat',
  'Bannu',
  'Swat',
  'Gwadar'
];

export const COURIER_PARTNERS = [
  { id: 'Trax', name: 'Trax Logistics (COD Specialist)', trackingPrefix: 'TRX' },
  { id: 'Leopard', name: 'Leopards Courier Service', trackingPrefix: 'LCS' },
  { id: 'TCS', name: 'TCS Express Pakistan', trackingPrefix: 'TCS' },
  { id: 'CallCourier', name: 'Call Courier (Excel Group)', trackingPrefix: 'CC' },
  { id: 'PostEx', name: 'PostEx Fintech & Courier', trackingPrefix: 'PEX' },
  { id: 'M&P', name: 'M&P Express Logistics', trackingPrefix: 'MNP' }
];

export const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; badgeClass: string; desc: string }> = {
  pending_confirmation: {
    label: 'Pending Confirmation',
    color: 'amber',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    desc: 'Order placed via COD. Awaiting merchant confirmation.'
  },
  confirmed: {
    label: 'Confirmed',
    color: 'blue',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    desc: 'Verified by call/WhatsApp. Inventory reserved.'
  },
  packed: {
    label: 'Packed & Ready',
    color: 'purple',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    desc: 'Packed with invoice. Ready for courier pickup.'
  },
  dispatched: {
    label: 'Dispatched (In Transit)',
    color: 'indigo',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    desc: 'Handed over to courier with CN/Tracking number.'
  },
  delivered: {
    label: 'Delivered (Cash Collected)',
    color: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    desc: 'Package delivered to customer. COD amount realized.'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'zinc',
    badgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-300',
    desc: 'Cancelled by customer or failed verification.'
  },
  returned: {
    label: 'Returned (RTO)',
    color: 'rose',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    desc: 'Return to origin after 3 delivery attempts.'
  }
};

export const PRODUCT_CATEGORIES = [
  'All Products',
  'Apparel & Kurtas',
  'Peshawari & Footwear',
  'Everyday Essentials',
  'Leather & Wallets',
  'Accessories'
];
