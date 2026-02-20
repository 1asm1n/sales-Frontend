package br.edu.ufop.web.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.edu.ufop.web.sales.entity.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}