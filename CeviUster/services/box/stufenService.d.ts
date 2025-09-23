export declare function fetchStufenData(): Promise<Stufe[]>;

interface Stufe {
  stufen_id: number;
  name: string;
}