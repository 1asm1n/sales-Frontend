package br.edu.ufop.web.sales.controller;

import br.edu.ufop.web.sales.entity.Event;
import br.edu.ufop.web.sales.entity.Sale;
import br.edu.ufop.web.sales.repository.EventRepository;
import br.edu.ufop.web.sales.repository.SaleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
public class SaleController {

    private final SaleRepository saleRepository;
    private final EventRepository eventRepository;

    public SaleController(SaleRepository saleRepository, EventRepository eventRepository) {
        this.saleRepository = saleRepository;
        this.eventRepository = eventRepository;
    }

    @PostMapping
    public Sale create(@RequestBody Sale sale) {
        Event event = eventRepository.findById(sale.getEvent().getId()).orElseThrow();

        sale.setTotalAmount(event.getTicketPrice() * sale.getQuantity());
        sale.setStatus("EM_ABERTO");

        return saleRepository.save(sale);
    }

    @GetMapping
    public List<Sale> findAll() {
        return saleRepository.findAll();
    }

    @GetMapping("/{id}")
    public Sale findById(@PathVariable Long id) {
        return saleRepository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Sale update(@PathVariable Long id, @RequestBody Sale sale) {
        sale.setId(id);
        return saleRepository.save(sale);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        saleRepository.deleteById(id);
    }
}