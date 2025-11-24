import { describe, expect, it } from "vitest";
import { ENV } from "./_core/env";

/**
 * Teste de validação da Google API Key
 * 
 * Este teste verifica se a Google API Key está configurada corretamente
 * fazendo uma chamada simples à API de Geocoding.
 */
describe("Google API Integration", () => {
  it("should have GOOGLE_API_KEY configured", () => {
    expect(ENV.googleApiKey).toBeDefined();
    expect(ENV.googleApiKey).not.toBe("");
    expect(ENV.googleApiKey.length).toBeGreaterThan(10);
  });

  it("should validate Google API Key with Geocoding API", async () => {
    const apiKey = ENV.googleApiKey;
    
    // Fazer chamada simples à API de Geocoding
    // Usando endereço conhecido: Av. Paulista, São Paulo
    const address = encodeURIComponent("Av. Paulista, 1578, São Paulo, SP");
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Verificar se a API retornou sucesso
    expect(response.status).toBe(200);
    expect(data.status).toBe("OK");
    expect(data.results).toBeDefined();
    expect(data.results.length).toBeGreaterThan(0);
    
    // Verificar se retornou coordenadas válidas
    const location = data.results[0].geometry.location;
    expect(location.lat).toBeDefined();
    expect(location.lng).toBeDefined();
    
    // Verificar se as coordenadas estão na região de São Paulo
    expect(location.lat).toBeGreaterThan(-24);
    expect(location.lat).toBeLessThan(-23);
    expect(location.lng).toBeGreaterThan(-47);
    expect(location.lng).toBeLessThan(-46);
  }, 10000); // Timeout de 10s para chamada de API

  it("should handle invalid address gracefully", async () => {
    const apiKey = ENV.googleApiKey;
    
    // Endereço inválido
    const address = encodeURIComponent("ENDEREÇO_INEXISTENTE_12345_XPTO");
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // API deve retornar 200 mas com status ZERO_RESULTS
    expect(response.status).toBe(200);
    expect(data.status).toMatch(/ZERO_RESULTS|INVALID_REQUEST/);
  }, 10000);
});
