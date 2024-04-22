export type Package = {
  id: string;
  address: string;
  status: string;
};

export type FullPackage = {
  id: string;
  receiver_name: string;
  status: string;
  address: string;
  date: string;
  weight: number;
  user_id: number;
};

export type AddPackage = {
  address: string;
  receiver_name: string;
  date: string;
  weight: number | string;
};

export type DeliveryMan = {
  id: number;
  email: string;
  name: string;
  last_name: string;
  profile_photo: string;
  is_admin: boolean;
  is_confirmed: boolean;
  is_enabled: boolean;
  packagesQuantity: number;
  packagesDeliveredQuantity: number;
};

export type ButtonDarkBlueProps = {
  text: string | undefined;
  loading?: boolean;
};

export type CommonDeliveriesProps = {
  arrayPackages: Array<Package>;
  view: string;
  section: string;
  openSection?: string;
  setOpenSection?: (section: string) => void;
  onStartPackage: (packageId: string) => void;
};

export type HeaderProps = {
  text: string;
  showArrow?: boolean;
  link?: string;
};

export type PieChartProps = {
  percent: number;
};

export type SelectPackageProp = {
  package: FullPackage;
};

export type TablelistPackagesProps = {
  viewType: string;
  section: string;
  status: string;
  packageNumber: string;
  address: string;
  onStartPackage: (packageId: string) => void;
};
