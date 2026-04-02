export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  profile: { imagen: string } | null;
  _count: { parcelas: number };
};

export type Parcela = {
  id: number;
  municipio: string;
  municipioId: number;
  provincia: string;
  geom: GeoJSON.Polygon;
  recintoCount?: number;
};

export type Recinto = {
  id: number;
  parcelaId: number;
  cultivo: string;
  fechaSiembra: string | null;
  fechaCosecha: string | null;
  geom: GeoJSON.Polygon;
};

export type Provincia = {
  id: number;
  nombre: string;
};

export type Municipio = {
  id: number;
  nombre: string;
  provincia: {
    id: number;
    nombre: string;
  };
};
