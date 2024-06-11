mod nodejs_lib;

use neige_lua::{
    api::{CallApi, LuaApi, PushApi},
    state::LuaState,
};
use nodejs_lib::LuaNodeLib;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(module = "@/libs")]
extern "C" {
    pub fn printToNode(name: &str);
}

fn logger(ls: &mut dyn LuaApi) -> usize {
    let info = ls.to_string(-1);
    printToNode(&info);
    0
}

/// 运行lua代码
#[wasm_bindgen]
pub fn run(data: &[u8], file_name: &str) {
    let mut state = LuaState::new();
    state.aux_lib();
    state.register("logger", logger);
    state.nodejs_lib();
    state.load(data.to_vec(), file_name, "bt");
    state.call(0, 0)
}
