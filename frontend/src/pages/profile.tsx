import { useState } from "react";
import { Box, Typography, Avatar, Button, Grid, Paper, CircularProgress, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { useMeQuery, useGetUserCreatedGroupsQuery, useGetMessagesForUserQuery } from "../services/api";
import { useAppSelector } from "../store/store";

const Profile = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading: isUserLoading } = useMeQuery(undefined, { skip: !isAuthenticated });
  const { data: groupsData, isLoading: isGroupsLoading } = useGetUserCreatedGroupsQuery(undefined, { skip: !isAuthenticated });
  const { data: messagesData, isLoading: isMessagesLoading } = useGetMessagesForUserQuery(
    { recipient: userData?.data._id },
    { skip: !isAuthenticated || !userData?.data._id }
  );


  if (isUserLoading || isGroupsLoading || isMessagesLoading) {
    return (
      <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!userData?.data) {
    return (
      <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h6">Profile not found!</Typography>
      </Box>
    );
  }

  const { name, email, avatar, role, groupsCreated, groupsJoined } = userData.data;

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "90%",
          maxWidth: "1000px",
          borderRadius: "15px",
          padding: 4,
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
          color: "white",
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Avatar & User Details */}
          <Grid item xs={12} md={4} textAlign="center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
              <Avatar src={avatar} alt={name} sx={{ width: 120, height: 120, margin: "auto", border: "4px solid white" }} />
            </motion.div>
            <Typography variant="h5" sx={{ marginTop: 2, fontWeight: "bold" }}>
              {name}
            </Typography>
            <Typography variant="body1" color="lightgray">
              {email}
            </Typography>
            <Typography variant="body2" sx={{ color: "yellow", marginTop: 1 }}>
              {role.toUpperCase()}
            </Typography>
            <Button variant="contained" color="secondary" sx={{ marginTop: 3, borderRadius: "20px" }}>
              Edit Profile
            </Button>
          </Grid>

          {/* Groups Created & Joined */}
          <Grid item xs={12} md={8}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                Groups Created
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {groupsCreated.length > 0 ? (
                  groupsCreated.map((groupId, index) => (
                    <Paper key={index} elevation={4} sx={styles.groupCard}>
                      <Typography variant="body2">
                        {groupsData?.groups.find(group => group._id === groupId)?.name || "Unknown Group"}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="lightgray">
                    No groups created.
                  </Typography>
                )}
              </Box>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 3, marginBottom: 1 }}>
                Groups Joined
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {groupsJoined.length > 0 ? (
                  groupsJoined.map((groupId, index) => (
                    <Paper key={index} elevation={4} sx={styles.groupCard}>
                      <Typography variant="body2">
                        {groupsData?.groups.find(group => group._id === groupId)?.name || "Unknown Group"}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="lightgray">
                    No groups joined.
                  </Typography>
                )}
              </Box>
            </motion.div>
          </Grid>

          {/* Recent Messages */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 3 }}>
                Recent Messages
              </Typography>
              {messagesData?.data.length > 0 ? (
                messagesData.data.slice(0, 5).map((msg, index) => (
                  <Paper key={index} elevation={2} sx={styles.messageCard}>
                    <Typography variant="body2">{msg.content}</Typography>
                    <Typography variant="caption" color="lightgray">
                      {new Date(msg.createdAt!).toLocaleDateString()}
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="lightgray">
                  No messages yet.
                </Typography>
              )}
            </motion.div>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;

const styles = {
  groupCard: {
    padding: "10px",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(5px)",
    color: "white",
    minWidth: "120px",
    textAlign: "center",
  },
  messageCard: {
    padding: "10px",
    borderRadius: "10px",
    background: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(5px)",
    color: "white",
    marginTop: "5px",
  },
};
