use gloo_utils::format::JsValueSerdeExt;
use neige_lua::api::{GetApi, PushApi, SetApi};
use neige_lua::{api::LuaApi, state::LuaState, LuaValue};
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;

#[wasm_bindgen(module = "@/libs/vue-lib")]
extern "C" {
    pub fn genWebCode(name: &str, val: &JsValue);
}

pub trait LuaVueLib {
    fn vuejs_lib(&mut self);
}

impl LuaVueLib for LuaState {
    fn vuejs_lib(&mut self) {
        self.create_table(0, 1);
        self.push_rust_fn(gen_web_code);
        self.set_field(-2, "render");
        self.set_global("Vue");
    }
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
