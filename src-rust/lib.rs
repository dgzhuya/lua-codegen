mod nodejs_lib;

use neige_lua::{api::CallApi, state::LuaState};
use nodejs_lib::LuaNodeLib;
use wasm_bindgen::prelude::wasm_bindgen;

/// 运行lua代码
#[wasm_bindgen]
pub fn run(data: &[u8], file_name: &str) {
    let mut state = LuaState::new();
    state.aux_lib();
    state.nodejs_lib();
    state.load(data.to_vec(), file_name, "bt");
    state.call(0, 0)
}
