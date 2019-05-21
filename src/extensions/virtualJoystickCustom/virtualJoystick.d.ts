import { Nullable } from "@babylonjs/core/types";
import { Vector3 } from "@babylonjs/core/Maths/math";

/**
 * Defines the potential axis of a Joystick
 */
export declare enum JoystickAxis {
    /** X axis */
    X = 0,
    /** Y axis */
    Y = 1,
    /** Z axis */
    Z = 2
}
/**
 * Class used to define virtual joystick (used in touch mode)
 */
export declare class VirtualJoystick {
    /**
     * Gets or sets a boolean indicating that left and right values must be inverted
     */
    reverseLeftRight: boolean;
    /**
     * Gets or sets a boolean indicating that up and down values must be inverted
     */
    reverseUpDown: boolean;
    /**
     * Gets the offset value for the position (ie. the change of the position value)
     */
    deltaPosition: Vector3;
    /**
     * Gets a boolean indicating if the virtual joystick was pressed
     */
    pressed: boolean;
    /**
     * Canvas the virtual joystick will render onto, default z-index of this is 5
     */
    static Canvas: Nullable<HTMLCanvasElement>;
    private static _globalJoystickIndex;
    private static vjCanvasContext;
    private static vjCanvasWidth;
    private static vjCanvasHeight;
    private static halfWidth;
    private _action;
    private _axisTargetedByLeftAndRight;
    private _axisTargetedByUpAndDown;
    private _joystickSensibility;
    private _inversedSensibility;
    private _joystickPointerID;
    private _joystickColor;
    private _joystickPointerPos;
    private _joystickPreviousPointerPos;
    private _joystickPointerStartPos;
    private _deltaJoystickVector;
    private _leftJoystick;
    private _touches;
    private _onPointerDownHandlerRef;
    private _onPointerMoveHandlerRef;
    private _onPointerUpHandlerRef;
    private _onResize;
    /**
     * Creates a new virtual joystick
     * @param leftJoystick defines that the joystick is for left hand (false by default)
     */
    constructor(leftJoystick?: boolean);
    /**
     * Defines joystick sensibility (ie. the ratio beteen a physical move and virtual joystick position change)
     * @param newJoystickSensibility defines the new sensibility
     */
    setJoystickSensibility(newJoystickSensibility: number): void;
    private _onPointerDown;
    private _onPointerMove; // todo(carles): set back to private!
    private _onPointerUp;
    /**
    * Change the color of the virtual joystick
    * @param newColor a string that must be a CSS color value (like "red") or the hexa value (like "#FF0000")
    */
    setJoystickColor(newColor: string): void;
    /**
     * Defines a callback to call when the joystick is touched
     * @param action defines the callback
     */
    setActionOnTouch(action: () => any): void;
    /**
     * Defines which axis you'd like to control for left & right
     * @param axis defines the axis to use
     */
    setAxisForLeftRight(axis: JoystickAxis): void;
    /**
     * Defines which axis you'd like to control for up & down
     * @param axis defines the axis to use
     */
    setAxisForUpDown(axis: JoystickAxis): void;
    private _drawVirtualJoystick;
    /**
     * Release internal HTML canvas
     */
    releaseCanvas(): void;

    onPointerMove(delta: { x: number; y: number }): void;
}
