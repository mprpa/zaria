package com.company.zaria.repository;

import com.company.zaria.model.Color;
import com.company.zaria.model.Fabric;
import com.company.zaria.model.FabricState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FabricStateRepository extends JpaRepository <FabricState, Long> {

    List<FabricState> getAllByFabric(Fabric fabric);

    boolean existsByFabricAndColor(Fabric fabric, Color color);

    FabricState getByFabricAndColor(Fabric fabric, Color color);

}
