package com.company.zaria.repository;

import com.company.zaria.model.Fabric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FabricRepository extends JpaRepository <Fabric, Long> {

    Boolean existsByComposition(String composition);

    Fabric getByComposition(String composition);

}
