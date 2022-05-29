import { ButtonGroup, Flex, HStack, IconButton } from "@chakra-ui/react";
import {
    NumberInput,
    NumberIncrementStepper,
    NumberDecrementStepper,
    NumberInputField,
    NumberInputStepper,
} from "@chakra-ui/number-input";
import {
    TiMediaPlay,
    TiMediaRewind,
    TiMediaFastForward,
    TiMediaPause,
    TiMediaStop,
} from "react-icons/ti";
import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { useHotkeys } from "react-hotkeys-hook";

import { PlaybackState } from "@Types/Types";

interface PlayBackControllerProps {
    playbackState: PlaybackState;
    setPlaybackState: (playbackState: PlaybackState) => void;
    bpm: number;
    setBPM: (bpm: number) => void;
}

export const PlayBackController = (props: PlayBackControllerProps) => {
    const [bpm, setBpm] = useState(props.bpm);
    const [transportTime, setTransportTime] = useState("00:00.0");

    const seekAnimationRef = useRef(0);

    useEffect(() => {
        if (props.playbackState === 1) {
            seekAnimationRef.current = requestAnimationFrame(
                function UpdateSeek() {
                    const minutes = Math.floor(
                        Tone.Transport.seconds / 60
                    ).toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
                    });
                    const seconds = (
                        Tone.Transport.seconds % 60
                    ).toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                        maximumFractionDigits: 1,
                        minimumFractionDigits: 1,
                        useGrouping: false,
                    });

                    setTransportTime(minutes + ":" + seconds);
                    seekAnimationRef.current =
                        requestAnimationFrame(UpdateSeek);
                }
            );
        } else if (props.playbackState === 0) {
            // Stop
            setTransportTime("00:00.0");
            cancelAnimationFrame(seekAnimationRef.current);
        } else if (props.playbackState === 2) {
            //Pause
            cancelAnimationFrame(seekAnimationRef.current);
        }
    }, [props.playbackState]);

    useEffect(() => {
        setBpm(props.bpm);
    }, [props.bpm]);

    return (
        <HStack
            // height="20px"
            width="full"
            flexShrink={0}
            padding={2}
            spacing={2}
            bg="brand.primary"
            justifyContent="center"
        >
            <Flex
                borderRadius="sm"
                height="2rem"
                width="6rem"
                borderColor="secondary.500"
                borderWidth={1}
                justifyContent="center"
                alignItems="center"
                textColor="white"
            >
                {transportTime}
            </Flex>
            <ButtonGroup
                size="sm"
                isAttached
                variant="solid"
                colorScheme="secondary"
            >
                <IconButton
                    aria-label="rewind"
                    icon={<TiMediaRewind />}
                    borderWidth={1}
                    borderColor="secondary.700"
                />
                <IconButton
                    aria-label="play"
                    icon={<TiMediaPlay />}
                    borderWidth={1}
                    isDisabled={props.playbackState === 1}
                    borderColor="secondary.700"
                    onClick={() => props.setPlaybackState(1)}
                />
                <IconButton
                    aria-label="pause"
                    icon={<TiMediaPause />}
                    borderWidth={1}
                    isDisabled={props.playbackState === 2}
                    borderColor="secondary.700"
                    onClick={() => props.setPlaybackState(2)}
                />
                <IconButton
                    aria-label="stop"
                    icon={<TiMediaStop />}
                    borderWidth={1}
                    isDisabled={props.playbackState === 0}
                    borderColor="secondary.700"
                    onClick={() => props.setPlaybackState(0)}
                />
                <IconButton
                    aria-label="fast-forward"
                    icon={<TiMediaFastForward />}
                    borderWidth={1}
                    borderColor="secondary.700"
                />
            </ButtonGroup>

            <NumberInput
                allowMouseWheel
                size="sm"
                textColor="white"
                borderColor="secondary.500"
                boxSizing="border-box"
                borderWidth={0}
                maxWidth={20}
                min={30}
                max={600}
                value={bpm}
                onChange={(valueString) => {
                    setBpm(parseInt(valueString));
                }}
                defaultValue={120}
                borderRadius="sm"
                onBlur={(event) => {
                    props.setBPM(parseInt(event.target.value));
                }}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper borderColor="secondary.500" />
                    <NumberDecrementStepper borderColor="secondary.500" />
                </NumberInputStepper>
            </NumberInput>
        </HStack>
    );
};
