import React from 'react';
import FadeIn from 'react-fade-in';
interface WithFadeInProps {
    fadeInDelay: number;
}
export const withFadeIn = <P extends object>(Component: React.ComponentType<P>, Header = () => <React.Fragment></React.Fragment>) =>
    class WithFadeIn extends React.Component<P & WithFadeInProps> {
        render() {
            const {fadeInDelay, ...props} = this.props;
            return (
                <FadeIn transitionDuration={200} delay={fadeInDelay || 50}>
                    <Header/>
                    <Component {...props as P} />
                </FadeIn>
            )
        }
    };