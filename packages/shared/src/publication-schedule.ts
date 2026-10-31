export interface ScheduleInput { count: number; startAt: Date; endAt: Date; blockSize: number; itemIntervalMinutes: number; blockIntervalMinutes: number; occupied?: Date[] }
export function calculatePublicationSchedule(input: ScheduleInput) {
  if (!Number.isInteger(input.count) || input.count < 1 || !Number.isInteger(input.blockSize) || input.blockSize < 1 || input.itemIntervalMinutes < 1 || input.blockIntervalMinutes < 0 || input.endAt <= input.startAt) throw new Error("Configuração de agendamento inválida.");
  const occupied = new Set((input.occupied ?? []).map((date) => date.getTime())); const dates: Date[] = []; let current = new Date(input.startAt);
  for (let index = 0; index < input.count; index++) { if (index > 0) current = new Date(current.getTime() + (index % input.blockSize === 0 ? input.blockIntervalMinutes : input.itemIntervalMinutes) * 60000); while (occupied.has(current.getTime())) current = new Date(current.getTime() + 60000); if (current > input.endAt) throw new Error("A janela informada não comporta todas as vagas."); occupied.add(current.getTime()); dates.push(new Date(current)); }
  return dates;
}
