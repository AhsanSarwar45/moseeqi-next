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

import SeekHandle from "@Components/studio/SeekHandle";
import { ScrollbarStyle } from "@Styles/ScrollbarStyle";
import { noteLengthOptions, secondsPerWholeNote } from "@Data/Constants";

import {
    selectDeleteSelectedParts,
    selectProjectLength,
    selectTrackCount,
    useStore,
} from "@Data/Store";
import SequenceView from "./SequenceView";
import TracksInfoView from "./TracksInfoView";
import { FocusArea, FlexFocusArea } from "@Components/FocusArea";
import { Panel } from "@Interfaces/enums/Panel";
import useKeyMap from "@Hooks/useKeyMap";
import TracksSettingsView from "./TracksSettingsView";
import { ClearSelectedPartsIndices } from "@Utility/PartUtils";
import { DeleteSelectedTrack } from "@Utility/TrackUtils";

interface TracksViewProps {}

const TracksView = (props: TracksViewProps) => {
    const baseWholeNoteWidth = 40;
    const basePixelsPerSecond = baseWholeNoteWidth / secondsPerWholeNote;
    // const snapDivisions = 8;
    // const snapWidth = baseWholeNoteWidth / snapDivisions;

    const theme = useTheme();

    const scaleGridTop = useRef<Ruler>(null);
    const scaleGridMain = useRef<Ruler>(null);
    const scaleGridMinor = useRef<Ruler>(null);

    const [snapWidthIndex, setSnapWidthIndex] = useState(3);
    const [isSnappingOn, setIsSnappingOn] = useState(true);

    const trackCount = useStore(selectTrackCount);
    const projectLength = useStore(selectProjectLength);

    const deleteSelectedParts = useStore(selectDeleteSelectedParts);

    useKeyMap("DELETE_TRACKS", DeleteSelectedTrack);
    useKeyMap("DELETE_PARTS", deleteSelectedParts);

    const HandleWindowResize = () => {
        scaleGridTop.current?.resize();
        scaleGridMain.current?.resize();
        scaleGridMinor.current?.resize();
    };

    useEffect(() => {
        window.addEventListener("resize", HandleWindowResize);
        return () => {
            window.removeEventListener("resize", HandleWindowResize);
        };
    }, []);

    return (
        <VStack height="full" bgColor="primary.600" spacing={0}>
            <TracksSettingsView
                snapWidthIndex={snapWidthIndex}
                setSnapWidthIndex={setSnapWidthIndex}
                isSnappingOn={isSnappingOn}
                setIsSnappingOn={setIsSnappingOn}
            />
            <HStack
                alignItems="flex-start"
                spacing={0}
                width="full"
                height="full"
                overflowX="scroll"
                overflowY="scroll"
                sx={ScrollbarStyle}
                onMouseDown={(event) => {
                    if (event.currentTarget === event.target) {
                        ClearSelectedPartsIndices();
                    }
                }}
            >
                <VStack
                    spacing={0}
                    position="sticky"
                    left={0}
                    zIndex={500}
                    bgColor="primary.700"
                >
                    <FocusArea panel={Panel.TracksInfoView}>
                        <Box
                            height={30}
                            bgColor="primary.600"
                            borderBottom="1px solid gray"
                            position="sticky"
                            top={0}
                            left={0}
                            width={200}
                            zIndex={9300}
                        />
                        <TracksInfoView />
                        {/* <HStack
                            color="white"
                            paddingY={2}
                            paddingX={2}
                            width={200}
                            height={90}
                            boxSizing="border-box"
                            // borderBottomWidth={1}
                            borderColor={"gray.500"}
                            // height={200}
                            position="relative"
                            alignItems="flex-start"
                        ></HStack> */}
                    </FocusArea>
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
                    <FocusArea
                        panel={Panel.SequenceView}
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
                            snapWidth={
                                isSnappingOn
                                    ? baseWholeNoteWidth /
                                      noteLengthOptions[snapWidthIndex].divisor
                                    : 1
                            }
                        />
                    </FocusArea>
                </VStack>
            </HStack>
        </VStack>
    );
};

TracksView.displayName = "TracksView";

export default TracksView;
