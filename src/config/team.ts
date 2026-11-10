/**
 * Data profil tim proyek SpaceX.
 * Urutan sesuai struktur organisasi yang diminta:
 * 1 Owner, 1 Direktur, 1 Asisten Direktur, 1 CEO, dan 2 Staf (wanita).
 * Kode kru (CREW-01…) diturunkan dari urutan array.
 */
import { teamBlur } from "./team-blur";

export type TeamMember = {
  name: string;
  role: string;
  description: string;
  photo: string;
  /** Blur placeholder base64 (digenerate scripts/team-blur.mjs). */
  blur: string;
  highlight?: boolean;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Maxentyo Raja S",
    role: "Owner",
    description:
      "Pendiri sekaligus pemilik SpaceX. Bervisi menjadikan perjalanan ke Bulan sebagai pengalaman yang aman dan dapat dijangkau setiap orang.",
    photo: "/team/owner.jpg",
    blur: teamBlur["/team/owner.jpg"],
    highlight: true,
  },
  {
    name: "R Adhitya",
    role: "Direktur",
    description:
      "Memimpin seluruh operasional misi luar angkasa, mulai dari persiapan peluncuran hingga keselamatan penerbangan penumpang.",
    photo: "/team/direktur.jpg",
    blur: teamBlur["/team/direktur.jpg"],
  },
  {
    name: "Firas Al Fatih",
    role: "Asisten Direktur",
    description:
      "Mendampingi direktur dalam koordinasi misi, logistik roket, serta pengaturan jadwal peluncuran harian.",
    photo: "/team/asisten-direktur.jpg",
    blur: teamBlur["/team/asisten-direktur.jpg"],
  },
  {
    name: "Muhammad Iqbal",
    role: "CEO",
    description:
      "Chief Executive Officer yang mengarahkan strategi perusahaan dan memastikan setiap pelanggan mendapatkan pelayanan terbaik.",
    photo: "/team/ceo.jpg",
    blur: teamBlur["/team/ceo.jpg"],
  },
  {
    name: "Alyssa Maharani",
    role: "Staff Operasional Penerbangan",
    description:
      "Mengurus check-in penumpang, dokumen misi, dan memastikan seluruh kebutuhan pra-peluncuran terpenuhi.",
    photo: "/team/staff-1.jpg",
    blur: teamBlur["/team/staff-1.jpg"],
  },
  {
    name: "Nadia Kirana Putri",
    role: "Staff Hubungan Pelanggan",
    description:
      "Siap membantu kebutuhan perjalanan Anda — dari pemilihan paket hingga pertanyaan menjelang hari keberangkatan.",
    photo: "/team/staff-2.jpg",
    blur: teamBlur["/team/staff-2.jpg"],
  },
];
