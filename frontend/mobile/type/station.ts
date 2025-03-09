export type StationType = "auditing" | "clinic" | "registrar" | "payment";


type Station = {
  id: string;
  name: string;
  description: string;
  type: StationType;
  activated: boolean;
}

export default Station;