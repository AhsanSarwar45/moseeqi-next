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

import { PlaybackState } from "@Interfaces/enums/PlaybackState";
import { selectKeymap, useKeymapStore } from "@Data/KeymapStore";
import useKeyMap from "@Hooks/useKeyMap";
import { selectBpm, selectPlaybackState, useStore } from "@Data/Store";
import { SetBpm } from "@Utility/BpmUtils";
import { SetPlaybackState, TogglePlayback } from "@Utility/PlaybackUtils";
import {
    PauseTransport,
    StartTransport,
    StopTransport,
} from "@Utility/TransportUtils";

interface PlayBackControllerProps {}

export const PlayBackController = (props: PlayBackControllerProps) => {
    const [localBpm, setLocalBpm] = useState(useStore.getState().bpm);
    const [transportTime, setTransportTime] = useState("00:00.0");

    const seekAnimationRef = useRef(0);

    const playbackState = useStore(selectPlaybackState);

    useKeyMap("TOGGLE_PLAYBACK", TogglePlayback);

    useEffect(
        () =>
            useStore.subscribe(selectPlaybackState, (playbackState) => {
                if (playbackState === PlaybackState.Stopped) {
                    StopTransport();
                    setTransportTime("00:00.0");
                    cancelAnimationFrame(seekAnimationRef.current);
                } else if (playbackState === PlaybackState.Playing) {
                    StartTransport();
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
                } else if (playbackState === PlaybackState.Paused) {
                    PauseTransport();
                    cancelAnimationFrame(seekAnimationRef.current);
                }
            }),
        []
    );

    useEffect(
        () =>
            useStore.subscribe(selectBpm, (bpm) => {
                setLocalBpm(bpm);
            }),
        []
    );

    return (
        <HStack
            // height="20px"
            width="full"
            flexShrink={0}
            padding={2}
            spacing={2}
            bg="brand.primary"
            justifyContent="center"
            boxShadow="md"
            zIndex={9999}
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
                    isDisabled={playbackState === PlaybackState.Playing}
                    borderColor="secondary.700"
                    onClick={() => SetPlaybackState(PlaybackState.Playing)}
                />
                <IconButton
                    aria-label="pause"
                    icon={<TiMediaPause />}
                    borderWidth={1}
                    isDisabled={playbackState === PlaybackState.Paused}
                    borderColor="secondary.700"
                    onClick={() => SetPlaybackState(PlaybackState.Paused)}
                />
                <IconButton
                    aria-label="stop"
                    icon={<TiMediaStop />}
                    borderWidth={1}
                    isDisabled={playbackState === PlaybackState.Stopped}
                    borderColor="secondary.700"
                    onClick={() => SetPlaybackState(PlaybackState.Stopped)}
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
                value={localBpm}
                onChange={(valueString) => {
                    setLocalBpm(parseInt(valueString));
                }}
                defaultValue={120}
                borderRadius="sm"
                onBlur={(event) => {
                    SetBpm(parseInt(event.target.value));
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
