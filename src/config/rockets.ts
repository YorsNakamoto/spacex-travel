/**
 * Model roket dan daftar harga paket perjalanan ke Bulan.
 */
export type RocketModel = {
  id: "z1150" | "special000";
  name: string;
  series: string;
  price: number; // harga dalam Rupiah per penumpang
  priceLabel: string;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
  accent: "violet" | "gold";
};

export const rocketModels: RocketModel[] = [
  {
    id: "z1150",
    name: "SpaceX Z1150",
    series: "Series Klasik",
    price: 4_900_000_000,
    priceLabel: "Rp 4,9 M",
    duration: "Transit 3 Hari",
    description:
      "Paket klasik andalan kami. Perjalanan nyaman menuju Bulan dengan fasilitas lengkap dan harga yang paling bersahabat.",
    features: [
      "Kursi jendela kelas standar",
      "Transit 3 hari ke Bulan (sekali jalan)",
      "Moonwalk berpemandu 15 menit",
      "Makanan astronot standar",
      "Pelatihan pra-penerbangan 2 hari",
      "Paket kenang-kenangan misi",
    ],
    accent: "violet",
  },
  {
    id: "special000",
    name: "SpaceX Special 000",
    series: "Series Ultra VIP",
    price: 9_900_000_000,
    priceLabel: "Rp 9,9 M",
    duration: "Transit Ekspres",
    description:
      "Pengalaman paling mewah yang pernah ada. Suite privat, pelayanan butler astronot, dan moonwalk eksklusif di permukaan Bulan.",
    features: [
      "Suite privat dengan panorama 360°",
      "Transit ekspres orbit langsung",
      "Moonwalk privat 30 menit + foto profesional",
      "Butler astronot pribadi",
      "Fine dining menu khusus chef",
      "Suit spacewalk custom bermerek",
      "Prioritas boarding + lounge VIP kosmodrum",
      "Asuransi perjalanan premium",
    ],
    popular: true,
    accent: "gold",
  },
];

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getRocketById(id: string): RocketModel | undefined {
  return rocketModels.find((r) => r.id === id);
}
