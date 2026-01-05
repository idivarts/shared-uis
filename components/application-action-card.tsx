import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import useBreakpoints from "@/shared-libs/utils/use-breakpoints";
import { useConfirmationModel } from "@/shared-uis/components/ConfirmationModal";
import { Text, View } from "@/shared-uis/components/theme/Themed";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useTheme } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { IconButton, List, Button as PaperButton, Surface } from "react-native-paper";
import { convertToKUnits } from "../utils/conversion";
import BottomSheetContainer from "./bottom-sheet";


export const ApplicationActionBar: React.FC<{
    application: IApplications & {
        id: string;
    };
    onAccept?: () => void;
    onShortlist?: () => void;
    onReject?: () => void;
    onReopen?: () => void;
}> = ({ application, onAccept, onShortlist, onReject, onReopen }) => {
    const { openModal } = useConfirmationModel()
    const handleApplication = async (
        status: IApplications["status"]
    ) => {
        try {
            if (!application) return;
            if (!application.id)
                return
            const applicationRef = doc(
                FirestoreDB,
                "collaborations",
                application.collaborationId,
                "applications",
                application.id,
            );
            await updateDoc(applicationRef, {
                status: status,
            }).then(() => {
            });
        } catch (error) {
            Console.error(error);
            Toaster.error("Failed to accept application");
        }
    };

    const theme = useTheme();
    // const [confirm, setConfirm] = React.useState<null | { type: "accept" | "reject" | "reopen" | "shortlist"; title: string; desc: string }>(null);

    const [status, setStatus] = useState(application.status)
    const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
    const { xl } = useBreakpoints();

    const handle = async (type: "accept" | "reject" | "reopen" | "shortlist") => {
        switch (type) {
            case "accept":
                await handleApplication("accepted")
                if (onAccept) onAccept();
                setStatus("accepted")
                break;
            case "shortlist":
                await handleApplication("shortlisted")
                if (onShortlist) onShortlist();
                Toaster.success("Application Shortlisted")
                setStatus("shortlisted")
                break;
            case "reject":
                await handleApplication("rejected")
                if (onReject) onReject();
                Toaster.success("Application Rejected")
                setStatus("rejected")
                break;
            case "reopen":
                await handleApplication("pending")
                if (onReopen) onReopen();
                Toaster.success("Application Reopened")
                setStatus("pending")
                break;
        }
    };

    const dividerColor = theme.dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
    const isCompact = !xl;

    const confirmAccept = () => {
        openModal({
            title: "Accept application?",
            description: "This will create a message thread between you and the selected influencer.",
            confirmText: "Accept",
            confirmAction: () => handle("accept"),
        });
    };

    const handleAcceptFromSheet = () => {
        setIsActionSheetOpen(false);
        confirmAccept();
    };

    const handleRejectFromSheet = () => {
        setIsActionSheetOpen(false);
        handle("reject");
    };

    const renderButtons = () => {
        switch (status) {
            case "pending":
                if (isCompact) {
                    return (
                        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <PaperButton
                                mode="contained"
                                onPress={() => handle("shortlist")}
                            >
                                Shortlist
                            </PaperButton>
                            <IconButton
                                icon="dots-vertical"
                                onPress={() => setIsActionSheetOpen(true)}
                                accessibilityLabel="More actions"
                            />
                        </View>
                    );
                }
                return (
                    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        <PaperButton
                            mode="contained"
                            onPress={() => handle("shortlist")}
                        >
                            Shortlist
                        </PaperButton>
                        <PaperButton
                            mode="elevated"
                            onPress={confirmAccept}
                        >
                            Accept
                        </PaperButton>
                        <PaperButton
                            mode="text"
                            onPress={() => handle("reject")}
                        >
                            Reject
                        </PaperButton>
                    </View>
                );
            case "accepted":
                return (
                    <PaperButton mode="contained" disabled>
                        Accepted
                    </PaperButton>
                );
            case "shortlisted":
                if (isCompact) {
                    return (
                        <IconButton
                            icon="dots-vertical"
                            onPress={() => setIsActionSheetOpen(true)}
                            accessibilityLabel="More actions"
                        />
                    );
                }
                return (
                    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        <PaperButton
                            mode="contained"
                            onPress={confirmAccept}
                        >
                            Accept
                        </PaperButton>
                        <PaperButton
                            mode="text"
                            onPress={() => handle("reject")}
                        >
                            Reject
                        </PaperButton>
                    </View>
                );
            case "rejected":
                return (
                    <PaperButton
                        mode="elevated"
                        onPress={() => handle("reopen")}
                    >
                        Reopen
                    </PaperButton>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Surface style={{ borderRadius: 12, elevation: 2, overflow: "hidden" }}>
                <View style={{ flexDirection: "row", alignItems: "center", padding: 12, gap: 12 }}>
                    {/* Left: Quotation */}
                    <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Quotation</Text>
                        <Text style={{ fontSize: 18, fontWeight: "700" }}>
                            {convertToKUnits(Number(application.quotation)) as string}
                        </Text>
                    </View>

                    {/* Divider */}
                    <View style={{ width: 1, alignSelf: "stretch", backgroundColor: dividerColor }} />

                    {/* Right: Actions */}
                    <View style={{ flexShrink: 0, flexGrow: 0, alignItems: "flex-end" }}>{renderButtons()}</View>
                </View>
            </Surface>
            {isCompact && (status === "pending" || status === "shortlisted") && (
                <BottomSheetContainer
                    isVisible={isActionSheetOpen}
                    onClose={() => setIsActionSheetOpen(false)}
                    snapPoints={["25%", "35%"]}
                    enablePanDownToClose
                    index={0}
                    backgroundStyle={{ backgroundColor: theme.colors.background }}
                    handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}
                >
                    <List.Section style={{ paddingBottom: 16 }}>
                        <List.Item title="Accept" onPress={handleAcceptFromSheet} />
                        <List.Item title="Reject" onPress={handleRejectFromSheet} />
                    </List.Section>
                </BottomSheetContainer>
            )}

            {/* Confirmation Dialog
            <Portal>
                <Dialog visible={!!confirm} onDismiss={() => setConfirm(null)}>
                    <Dialog.Title>{confirm?.title}</Dialog.Title>
                    <Dialog.Content>
                        <Text>{confirm?.desc}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <PaperButton onPress={() => setConfirm(null)}>Cancel</PaperButton>
                        {confirm && (
                            <PaperButton onPress={() => handle(confirm.type)}>Confirm</PaperButton>
                        )}
                    </Dialog.Actions>
                </Dialog>
            </Portal> */}
        </>
    );
};
