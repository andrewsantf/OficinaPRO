// services/fipe.ts
export interface FipeItem {
    codigo: string;
    nome: string;
}

const BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

export async function getBrands(type: 'carros' | 'motos' | 'caminhoes' = 'carros'): Promise<FipeItem[]> {
    const response = await fetch(`${BASE_URL}/${type}/marcas`);
    if (!response.ok) throw new Error('Failed to fetch brands');
    return response.json();
}

export async function getModels(brandId: string, type: 'carros' | 'motos' | 'caminhoes' = 'carros') {
    const response = await fetch(`${BASE_URL}/${type}/marcas/${brandId}/modelos`);
    if (!response.ok) throw new Error('Failed to fetch models');
    const data = await response.json();
    return data.modelos as FipeItem[];
}

export async function getYears(brandId: string, modelId: string, type: 'carros' | 'motos' | 'caminhoes' = 'carros'): Promise<FipeItem[]> {
    const response = await fetch(`${BASE_URL}/${type}/marcas/${brandId}/modelos/${modelId}/anos`);
    if (!response.ok) throw new Error('Failed to fetch years');
    return response.json();
}

export interface FipeData {
    Valor: string;
    Marca: string;
    Modelo: string;
    AnoModelo: number;
    Combustivel: string;
    CodigoFipe: string;
    MesReferencia: string;
    TipoVeiculo: number;
    SiglaCombustivel: string;
}

export async function getFipeData(brandId: string, modelId: string, yearId: string, type: 'carros' | 'motos' | 'caminhoes' = 'carros'): Promise<FipeData> {
    const response = await fetch(`${BASE_URL}/${type}/marcas/${brandId}/modelos/${modelId}/anos/${yearId}`);
    if (!response.ok) throw new Error('Failed to fetch FIPE data');
    return response.json();
}
