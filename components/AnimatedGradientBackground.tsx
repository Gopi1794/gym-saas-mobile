import React, { useEffect, useRef, useState } from "react"
import { AccessibilityInfo, Animated, Easing, StyleSheet, View, useWindowDimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors } from "../constants/theme"

// Black -> deep brand red -> black, built from the theme colors only.
const GRADIENT_COLORS = [colors.background, "#5A0000", colors.brand, "#5A0000", colors.background] as const
const HALF_CYCLE_MS = 10000 // full back-and-forth cycle is ~20 s
const OVERSIZE = 2.5

/**
 * Slow red/black gradient that drifts behind the screen content.
 * An oversized gradient layer is translated/rotated with the native driver
 * (transform only). With reduced motion enabled it renders statically.
 */
export default function AnimatedGradientBackground() {
  const { width, height } = useWindowDimensions()
  const progress = useRef(new Animated.Value(0)).current
  // Start static until the accessibility setting is known.
  const [reduceMotion, setReduceMotion] = useState(true)

  useEffect(() => {
    let active = true
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (active) setReduceMotion(enabled)
      })
      .catch(() => {
        if (active) setReduceMotion(false)
      })
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion)
    return () => {
      active = false
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    progress.setValue(0)
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: HALF_CYCLE_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: HALF_CYCLE_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [reduceMotion, progress])

  const layerWidth = width * OVERSIZE
  const layerHeight = height * OVERSIZE
  const layerStyle = {
    position: "absolute" as const,
    width: layerWidth,
    height: layerHeight,
    left: (width - layerWidth) / 2,
    top: (height - layerHeight) / 2,
  }

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-width * 0.35, width * 0.35] })
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height * 0.2, -height * 0.2] })
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ["-8deg", "8deg"] })

  return (
    <View style={styles.root} pointerEvents="none" testID="animated-gradient-background">
      {reduceMotion ? (
        <LinearGradient
          testID="gradient-static"
          colors={GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <Animated.View testID="gradient-animated" style={[layerStyle, { transform: [{ translateX }, { translateY }, { rotate }] }]}>
          <LinearGradient colors={GRADIENT_COLORS} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
      )}
      {/* Dark scrim keeps text and inputs readable over the red. */}
      <View style={styles.scrim} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFill as object, backgroundColor: colors.background, overflow: "hidden" },
  scrim: { ...StyleSheet.absoluteFill as object, backgroundColor: "rgba(10,10,10,0.55)" },
})
