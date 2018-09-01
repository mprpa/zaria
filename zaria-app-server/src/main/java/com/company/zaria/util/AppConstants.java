package com.company.zaria.util;

import com.company.zaria.model.Size;

import java.util.HashMap;
import java.util.Map;

public class AppConstants {

    public static Map<Size, Float> SIZE_FLOAT_MAP = new HashMap<Size , Float>() {{
        put(Size.S, 1f);
        put(Size.M, 1.2f);
        put(Size.L, 1.4f);
        put(Size.XL, 1.6f);
        put(Size.XXL, 1.8f);
    }};

}
