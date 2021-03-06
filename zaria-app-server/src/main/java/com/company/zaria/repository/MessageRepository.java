package com.company.zaria.repository;

import com.company.zaria.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository <Message, Long> {

    List<Message> findAllByAnswered(boolean answered);

    List<Message> findAllBySeen(boolean seen);

    List<Message> findByIdIn(List<Long> ids);
}
