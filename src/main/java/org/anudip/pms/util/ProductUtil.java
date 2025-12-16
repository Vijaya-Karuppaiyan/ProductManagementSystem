package org.anudip.pms.util;

import org.anudip.pms.dto.ProductDto;
import org.anudip.pms.model.Product;

public class ProductUtil {

    public static ProductDto toDto(Product p) {
        if (p == null) return null;
        ProductDto dto = new ProductDto();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        return dto;
    }

    public static Product toEntity(ProductDto dto) {
        if (dto == null) return null;
        Product p = new Product();
        p.setId(dto.getId());
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        p.setPrice(dto.getPrice());
        return p;
    }
}