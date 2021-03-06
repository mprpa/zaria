package com.company.zaria.repository;

import com.company.zaria.model.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColorRepository extends JpaRepository <Color, Long> {

    Boolean existsByCode(String code);

    Color getByCode(String code);

}
