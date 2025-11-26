// Type declaration for react-rating-stars-component
declare module 'react-rating-stars-component' {
    import { Component } from 'react';

    export interface ReactStarsProps {
        count?: number;
        value?: number;
        char?: string | React.ReactElement;
        size?: number;
        color?: string;
        activeColor?: string;
        a11y?: boolean;
        isHalf?: boolean;
        emptyIcon?: React.ReactElement;
        halfIcon?: React.ReactElement;
        filledIcon?: React.ReactElement;
        edit?: boolean;
        onChange?: (newRating: number) => void;
        classNames?: string;
    }

    export default class ReactStars extends Component<ReactStarsProps> { }
}
