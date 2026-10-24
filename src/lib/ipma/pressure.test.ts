import { describe, it, expect } from "vitest";
import { nearestPressure } from "./pressure";
import type { Station } from "./stations";
import type { Observation } from "./observations";

function obs(pressure: number | null): Observation {
  return {
    temp: 15,
    humidity: 50,
    pressure,
    windKmh: 10,
    windDir: "N",
    precAccum: 0,
  };
}

const stations: Station[] = [
  { id: 1, name: "Perto sem pressão", lat: 40.2, lon: -8.43 },
  { id: 2, name: "Média com pressão", lat: 40.3, lon: -8.5 },
  { id: 3, name: "Longe com pressão", lat: 41.5, lon: -8.6 },
];

// Coimbra
const LAT = 40.21;
const LON = -8.43;

describe("nearestPressure", () => {
  it("usa a estação mais próxima COM pressão válida", () => {
    const observations = new Map<number, Observation>([
      [1, obs(null)], // mais perto mas sem pressão
      [2, obs(1028)], // próxima e com pressão → escolhida
      [3, obs(1010)],
    ]);
    expect(nearestPressure(stations, observations, LAT, LON)).toBe(1028);
  });

  it("arredonda a pressão para inteiro", () => {
    const observations = new Map<number, Observation>([[2, obs(1028.7)]]);
    expect(nearestPressure(stations, observations, LAT, LON)).toBe(1029);
  });

  it("devolve null se a única estação com pressão está longe demais", () => {
    const observations = new Map<number, Observation>([[3, obs(1010)]]);
    // estação 3 está a >100 km de Coimbra → fora do raio
    expect(nearestPressure(stations, observations, LAT, LON)).toBeNull();
  });

  it("devolve null sem observações", () => {
    expect(nearestPressure(stations, new Map(), LAT, LON)).toBeNull();
  });
});
