import axe from 'axe-core';

/** Corre axe sobre un contenedor y devuelve las violaciones (vacío = OK).
 *  Uso: expect(await axeViolations(container)).toEqual([]) */
export async function axeViolations(container: Element) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } }, // jsdom no calcula estilos reales
  });
  return results.violations.map(v => `${v.id}: ${v.help} (${v.nodes.length})`);
}
