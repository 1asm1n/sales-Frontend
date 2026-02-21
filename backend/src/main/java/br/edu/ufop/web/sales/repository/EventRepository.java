package br.edu.ufop.web.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.edu.ufop.web.sales.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}