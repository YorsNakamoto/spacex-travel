import { create } from "zustand";

/** Data hasil pemesanan sukses yang ditampilkan pada dialog & animasi. */
export type BookingSuccessData = {
  bookingCode: string;
  rocketName: string;
  rocketId: "z1150" | "special000";
  totalPriceLabel: string;
  departureDate: string;
  passengers: number;
  emailSent: boolean;
  emailMessage: string;
  customerName: string;
  customerPhone: string;
};

type LaunchStore = {
  /** true saat animasi roket terbang sedang berjalan */
  isLaunching: boolean;
  /** dialog sukses terbuka setelah animasi selesai */
  successOpen: boolean;
  data: BookingSuccessData | null;
  launch: (data: BookingSuccessData) => void;
  finishLaunch: () => void;
  closeSuccess: () => void;
};

export const useLaunchStore = create<LaunchStore>((set) => ({
  isLaunching: false,
  successOpen: false,
  data: null,
  launch: (data) => set({ isLaunching: true, successOpen: false, data }),
  /** Dipanggil komponen overlay ketika animasi roket selesai */
  finishLaunch: () => set({ isLaunching: false, successOpen: true }),
  closeSuccess: () => set({ successOpen: false, data: null }),
}));
