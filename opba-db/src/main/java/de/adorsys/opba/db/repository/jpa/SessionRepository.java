package de.adorsys.opba.db.repository.jpa;

import de.adorsys.opba.db.domain.entity.sessions.SessionFromAspsp;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface SessionRepository extends CrudRepository<SessionFromAspsp, Long> {
        Optional<SessionFromAspsp> findByAuthId(String authId);
    }


