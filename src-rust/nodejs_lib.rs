use gloo_utils::format::JsValueSerdeExt;
use neige_lua::api::{GetApi, LuaApi, PushApi, SetApi};
use neige_lua::state::LuaState;
use neige_lua::LuaValue;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;

#[wasm_bindgen(module = "src/libs/index.ts")]
extern "C" {
    pub fn genWebCode(name: &str, val: &JsValue);
    pub fn genApiCode(name: &str);
}

fn gen_api_code(ls: &mut dyn LuaApi) -> usize {
    let name = ls.to_string(-1);
    genApiCode(&name);
    0
}

fn gen_web_code(ls: &mut dyn LuaApi) -> usize {
    let info = ls.to_string(-2);
    let route = if ls.is_lua_tbl(-1) {
        let val = ls.to_lua_tbl(-1).unwrap();
        JsValue::from_serde(&LuaValue::Table(val)).unwrap_or(JsValue::null())
    } else {
        JsValue::null()
    };
    genWebCode(&info, &route);
    0
}

pub trait LuaNodeLib {
    fn nodejs_lib(&mut self);
}

impl LuaNodeLib for LuaState {
    fn nodejs_lib(&mut self) {
        self.create_table(0, 1);
        self.push_rust_fn(gen_web_code);
        self.set_field(-2, "genFontCode");
        self.push_rust_fn(gen_api_code);
        self.set_field(-2, "genApiCode");
        self.set_global("NodeJs");
    }
}
