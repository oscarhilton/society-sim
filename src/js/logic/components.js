import {
    Types,
    defineComponent,
} from 'bitecs'

export const Status = defineComponent({
    isAlive: Types.ui8, // 1 for alive, 0 for dead
});

export const Food = defineComponent({
    x: Types.f32,
    y: Types.f32,
    amount: Types.f32, // Remaining food quantity
});

export const Water = defineComponent({
    x: Types.f32,
    y: Types.f32,
    amount: Types.f32, // Remaining water quantity
});

export const Motivation = defineComponent({
    hunger: Types.f32,
    thirst: Types.f32,
    energy: Types.f32,
    curiosity: Types.f32,
});

export const Position = defineComponent({
    x: Types.f32,
    y: Types.f32,
});

export const PreviousPosition = defineComponent({
    x: Types.f32,
    y: Types.f32
});

export const Velocity = defineComponent({
    dx: Types.f32,
    dy: Types.f32,
});