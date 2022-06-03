import React, { Fragment, useRef, useEffect } from "react";
import {
    Box,
    VStack,
    HStack,
    useDisclosure,
    useTheme,
    Icon,
} from "@chakra-ui/react";

import Ruler from "@scena/react-ruler";
import { useState } from "react";

import { AddTrackModal } from "./AddTrackModal";
import SeekHandle from "@Components/studio/SeekHandle";
import { ScrollbarStyle } from "@Styles/ScrollbarStyle";
import { secondsPerWholeNote } from "@Data/Constants";
import TooltipButton from "@Components/TooltipButton";
import {
    selectDeleteSelectedTrack,
    selectTrackCount,
    useTracksStore,
} from "@Data/TracksStore";
import { selectProjectLength, useProjectStore } from "@Data/ProjectStore";
import SequenceView from "./SequenceView";
import TracksInfoView from "./TracksInfoView";
import TracksEditBar from "./TracksEditBar";
import { selectKeymap, useKeymapStore } from "@Data/KeymapStore";
import { useHotkeys } from "react-hotkeys-hook";

interface TracksViewProps {}

const TracksView = (props: TracksViewProps) => {
    const baseWholeNoteWidth = 40;
    const basePixelsPerSecond = baseWholeNoteWidth / secondsPerWholeNote;
    const snapDivisions = 8;
    const snapWidth = baseWholeNoteWidth / snapDivisions;

    const theme = useTheme();

    const scaleGridTop = useRef<Ruler>(null);
    const scaleGridMain = useRef<Ruler>(null);
    const scaleGridMinor = useRef<Ruler>(null);

    const clearSelectedPartsIndices = useTracksStore(
        (state) => state.clearSelectedPartsIndices
    );
    const trackCount = useTracksStore(selectTrackCount);
    const projectLength = useProjectStore(selectProjectLength);

    const deleteSelectedTrack = useTracksStore(selectDeleteSelectedTrack);

    const keymap = useKeymapStore(selectKeymap);

    const deleteTracksScopeRef = useHotkeys(keymap.DELETE_TRACKS, () => {
        // console.log("delete tracks");
        deleteSelectedTrack();
    });

    useEffect(() => {
        window.addEventListener("resize", () => {
            scaleGridTop.current?.resize();
            scaleGridMain.current?.resize();
            scaleGridMinor.current?.resize();
        });
        return () => {
            window.removeEventListener("resize", () => {});
        };
    }, []);

    return (
        <Fragment>
            <HStack
                alignItems="flex-start"
                spacing={0}
                width="full"
                height="100%"
                overflowX="scroll"
                overflowY="scroll"
                sx={ScrollbarStyle}
                bgColor="primary.600"
                onClick={(event) => {
                    if (event.currentTarget === event.target) {
                        clearSelectedPartsIndices();
                    }
                }}
            >
                <VStack
                    spacing={0}
                    position="sticky"
                    left={0}
                    zIndex={500}
                    tabIndex={-1}
                    _focusVisible={{ outlineWidth: 0 }}
                    ref={deleteTracksScopeRef as any}
                >
                    <TracksEditBar />
                    <TracksInfoView />
                </VStack>

                <VStack alignItems="flex-start" spacing={0}>
                    <Box
                        height="30px"
                        padding="0px"
                        width={projectLength * basePixelsPerSecond}
                        position="sticky"
                        top={0}
                        zIndex={400}
                    >
                        <SeekHandle height={30 + 90 * trackCount} />
                        <Ruler
                            type="horizontal"
                            unit={1}
                            zoom={40}
                            ref={scaleGridTop}
                            backgroundColor={theme.colors.primary[600]}
                            segment={4}
                        />
                    </Box>
                    <Box
                        height={90 * trackCount}
                        padding="0px"
                        width={projectLength * basePixelsPerSecond}
                        marginTop="30px"
                        position="relative"
                    >
                        <Ruler
                            type="horizontal"
                            unit={1}
                            zoom={40}
                            ref={scaleGridMinor}
                            backgroundColor={theme.colors.primary[400]}
                            segment={4}
                            mainLineSize={0}
                            shortLineSize={90 * trackCount}
                            longLineSize={90 * trackCount}
                            height={90 * trackCount}
                            lineColor="rgba(255,255,255,0.1)"
                            textColor="rgba(0,0,0,0)"
                        />
                        <SequenceView
                            basePixelsPerSecond={basePixelsPerSecond}
                            snapWidth={snapWidth}
                        />
                    </Box>
                </VStack>
            </HStack>
        </Fragment>
    );
};

TracksView.displayName = "TracksView";

export default TracksView;
