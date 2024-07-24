import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    findAll(): Promise<import("./entities/product.entity").Product[]>;
    findOne(id: number): Promise<import("./entities/product.entity").Product>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<import("./entities/product.entity").Product>;
    remove(id: number): Promise<void>;
}
