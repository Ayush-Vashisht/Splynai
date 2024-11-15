export interface ICar {
  _id?: Key | null | undefined;
  id?: number;
  title: string;
  description: string;
  company:string
  carType: string;
  dealer: string;
  tags: string[];
  images: string[];
}

export interface CAR {
  id?: number;
  title: string;
  description: string;
  company:string
  carType: string;
  dealer: string;
  tags: string[];
  images: string[];
}