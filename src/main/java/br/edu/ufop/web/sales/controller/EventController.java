package br.edu.ufop.web.sales.controller;

import br.edu.ufop.web.sales.entity.Event;
import br.edu.ufop.web.sales.repository.EventRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventRepository repository;

    public EventController(EventRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Event create(@RequestBody Event event) {
        return repository.save(event);
    }

    @GetMapping
    public List<Event> findAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Event findById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Event update(@PathVariable Long id, @RequestBody Event event) {
        event.setId(id);
        return repository.save(event);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}