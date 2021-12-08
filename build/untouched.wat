(module
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $f32_=>_none (func (param f32)))
 (import "env" "memory" (memory $0 0))
 (global $assembly/index/R (mut f32) (f32.const 0))
 (global $assembly/index/G (mut f32) (f32.const 0))
 (global $assembly/index/B (mut f32) (f32.const 0))
 (global $assembly/index/width (mut i32) (i32.const 0))
 (global $assembly/index/height (mut i32) (i32.const 0))
 (export "init" (func $assembly/index/init))
 (export "cycle" (func $assembly/index/cycle))
 (export "memory" (memory $0))
 (func $assembly/index/init (param $0 i32) (param $1 i32)
  local.get $0
  global.set $assembly/index/width
  local.get $1
  global.set $assembly/index/height
 )
 (func $assembly/index/cycle (param $0 f32)
  (local $1 i32)
  (local $2 i32)
  (local $3 f32)
  (local $4 i32)
  (local $5 f32)
  (local $6 f32)
  (local $7 f32)
  (local $8 i32)
  (local $9 f32)
  (local $10 f32)
  loop $for-loop|0
   global.get $assembly/index/height
   local.get $2
   i32.gt_s
   if
    i32.const 0
    local.set $1
    loop $for-loop|1
     global.get $assembly/index/width
     local.get $1
     i32.gt_s
     if
      local.get $1
      local.get $2
      global.get $assembly/index/width
      local.tee $4
      local.tee $8
      i32.mul
      i32.add
      i32.const 12
      i32.mul
      local.get $8
      global.get $assembly/index/height
      local.tee $8
      i32.mul
      i32.const 2
      i32.shl
      i32.add
      f32.load
      local.get $0
      f32.add
      local.tee $3
      local.get $3
      f32.floor
      f32.sub
      f32.const 6
      f32.mul
      local.tee $7
      f32.floor
      local.set $3
      local.get $1
      local.get $2
      local.get $4
      i32.mul
      i32.add
      i32.const 12
      i32.mul
      local.get $4
      local.get $8
      i32.mul
      i32.const 2
      i32.shl
      i32.add
      local.tee $4
      f32.load offset=8
      local.tee $5
      f32.const 1
      local.get $4
      f32.load offset=4
      local.tee $6
      f32.sub
      f32.mul
      local.set $9
      local.get $5
      f32.const 1
      local.get $7
      local.get $3
      f32.sub
      local.tee $10
      local.get $6
      f32.mul
      f32.sub
      f32.mul
      local.set $7
      local.get $5
      f32.const 1
      f32.const 1
      local.get $10
      f32.sub
      local.get $6
      f32.mul
      f32.sub
      f32.mul
      local.set $6
      block $break|2
       block $case5|2
        block $case4|2
         block $case3|2
          block $case2|2
           block $case1|2
            block $case0|2
             local.get $3
             i32.trunc_f32_u
             i32.const 6
             i32.rem_u
             br_table $case0|2 $case1|2 $case2|2 $case3|2 $case4|2 $case5|2 $break|2
            end
            local.get $5
            global.set $assembly/index/R
            local.get $6
            global.set $assembly/index/G
            local.get $9
            global.set $assembly/index/B
            br $break|2
           end
           local.get $7
           global.set $assembly/index/R
           local.get $5
           global.set $assembly/index/G
           local.get $9
           global.set $assembly/index/B
           br $break|2
          end
          local.get $9
          global.set $assembly/index/R
          local.get $5
          global.set $assembly/index/G
          local.get $6
          global.set $assembly/index/B
          br $break|2
         end
         local.get $9
         global.set $assembly/index/R
         local.get $7
         global.set $assembly/index/G
         local.get $5
         global.set $assembly/index/B
         br $break|2
        end
        local.get $6
        global.set $assembly/index/R
        local.get $9
        global.set $assembly/index/G
        local.get $5
        global.set $assembly/index/B
        br $break|2
       end
       local.get $5
       global.set $assembly/index/R
       local.get $9
       global.set $assembly/index/G
       local.get $7
       global.set $assembly/index/B
      end
      local.get $1
      global.get $assembly/index/width
      local.get $2
      i32.mul
      i32.add
      i32.const 2
      i32.shl
      local.tee $4
      global.get $assembly/index/R
      f32.const 255
      f32.mul
      i32.trunc_f32_u
      i32.store8
      local.get $4
      global.get $assembly/index/G
      f32.const 255
      f32.mul
      i32.trunc_f32_u
      i32.store8 offset=1
      local.get $4
      global.get $assembly/index/B
      f32.const 255
      f32.mul
      i32.trunc_f32_u
      i32.store8 offset=2
      local.get $4
      i32.const 255
      i32.store8 offset=3
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|1
     end
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
 )
)
