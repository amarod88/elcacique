import { Producto } from '../types/index';
import productosRaw from './productos.json';

export const productos: Producto[] = productosRaw as Producto[];
export const SHARED_DATA_VERSION = '1.0.0';
