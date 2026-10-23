import { test, expect } from "@playwright/test";

test.describe("Previsão de localidade (mobile)", () => {
  test("mostra Lisboa, temperatura e 5 dias", async ({ page }) => {
    await page.goto("/lisboa");
    await expect(page.getByRole("heading", { name: "Lisboa" })).toBeVisible();
    // 5 linhas de previsão diária
    await expect(page.getByTestId("daily-row")).toHaveCount(5);
    // pelo menos uma temperatura visível no hero
    await expect(page.locator("text=/\\d+°/").first()).toBeVisible();
  });

  test("não tem overflow horizontal a 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/lisboa");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test("no mobile, o detalhe de 'agora' está escondido até expandir", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/lisboa");
    const vento = page.getByText("Vento", { exact: true });
    await expect(vento).toBeHidden(); // recolhido no <details>
    await page.getByText(/Mais detalhes/i).click();
    await expect(vento).toBeVisible(); // revelado
  });

  test("no desktop, o detalhe de 'agora' está sempre visível", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/lisboa");
    await expect(page.getByText("Vento", { exact: true })).toBeVisible();
    await expect(page.getByText(/Mais detalhes/i)).toBeHidden();
  });
});
