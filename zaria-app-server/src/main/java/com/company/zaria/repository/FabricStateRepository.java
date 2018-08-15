package com.company.zaria.repository;

import com.company.zaria.model.FabricState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FabricStateRepository extends JpaRepository <FabricState, Long> {
}
